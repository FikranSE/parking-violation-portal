package violations

import (
	"errors"
	"fmt"
	"time"

	"parking_violation_portal/internal/modules/rules"
)

// Service handles business logic for violations
type Service struct {
	repo         ViolationRepository
	rulesService rules.RuleService
}

// NewService creates a new Violations Service
func NewService(repo ViolationRepository, rulesService rules.RuleService) *Service {
	return &Service{
		repo:         repo,
		rulesService: rulesService,
	}
}

// ProcessNewViolation handles the submission of a new violation and calculates the fine
func (s *Service) ProcessNewViolation(licensePlate, violationType, location, photoURL string, violationTime time.Time) (*Violation, error) {
	// 1. Fetch active rules
	activeRule, err := s.rulesService.GetActiveRule()
	if err != nil {
		return nil, fmt.Errorf("failed to get active rule: %w", err)
	}
	if activeRule == nil {
		return nil, errors.New("no active fine rules found")
	}

	// 2. Determine base amount
	baseAmount, ok := activeRule.BaseAmounts[violationType]
	if !ok {
		return nil, fmt.Errorf("unknown violation type: %s", violationType)
	}

	// 3. Apply time multiplier
	timeMult := s.calculateTimeMultiplier(violationTime, activeRule.TimeMultipliers)

	// 4. Determine repeat violations (last 90 days)
	repeatCount, err := s.repo.CountUnpaidViolationsLast90Days(licensePlate, violationTime)
	if err != nil {
		return nil, fmt.Errorf("failed to count prior violations: %w", err)
	}

	// 5. Apply repeat multiplier
	repeatMult := s.calculateRepeatMultiplier(repeatCount, activeRule.RepeatMultipliers)

	// 6. Calculate total fine
	totalFine := baseAmount * timeMult * repeatMult

	// 7. Create and save violation record
	violation := &Violation{
		LicensePlate:   licensePlate,
		ViolationType:  violationType,
		Location:       location,
		ViolationTime:  violationTime,
		PhotoURL:       photoURL,
		RuleVersionID:  activeRule.ID,
		CalculatedFine: totalFine,
		Status:         "UNPAID",
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	err = s.repo.Save(violation)
	if err != nil {
		return nil, fmt.Errorf("failed to save violation: %w", err)
	}

	return violation, nil
}

// calculateTimeMultiplier determines the multiplier based on the violation time
func (s *Service) calculateTimeMultiplier(violationTime time.Time, multipliers []rules.TimeMultiplier) float64 {
	// Format time as HH:MM for comparison
	vtStr := violationTime.Format("15:04")

	for _, tm := range multipliers {
		// Handle overnight ranges like "22:00" to "06:00"
		if tm.StartTime > tm.EndTime {
			if vtStr >= tm.StartTime || vtStr <= tm.EndTime {
				return tm.Multiplier
			}
		} else {
			if vtStr >= tm.StartTime && vtStr <= tm.EndTime {
				return tm.Multiplier
			}
		}
	}

	return 1.0 // default
}

// calculateRepeatMultiplier determines the multiplier based on prior unpaid offenses
func (s *Service) calculateRepeatMultiplier(count int, repeatMultipliers map[string]float64) float64 {
	// Try specific count (e.g., "0", "1")
	key := fmt.Sprintf("%d", count)
	if mult, exists := repeatMultipliers[key]; exists {
		return mult
	}

	// If count >= 2, fallback to "2+"
	if count >= 2 {
		if mult, exists := repeatMultipliers["2+"]; exists {
			return mult
		}
	}

	return 1.0 // default
}
