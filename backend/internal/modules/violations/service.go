package violations

import (
	"errors"
	"fmt"
	"time"

	"parking_violation_portal/internal/modules/rules"
)

type Service struct {
	repo         ViolationRepository
	rulesService rules.RuleService
}

func NewService(repo ViolationRepository, rulesService rules.RuleService) *Service {
	return &Service{
		repo:         repo,
		rulesService: rulesService,
	}
}

func (s *Service) ProcessNewViolation(licensePlate, violationType, location, photoURL string, violationTime time.Time) (*Violation, error) {
	activeRule, err := s.rulesService.GetActiveRule()
	if err != nil {
		return nil, fmt.Errorf("failed to get active rule: %w", err)
	}
	if activeRule == nil {
		return nil, errors.New("no active fine rules found")
	}

	baseAmount, ok := activeRule.BaseAmounts[violationType]
	if !ok {
		return nil, fmt.Errorf("unknown violation type: %s", violationType)
	}

	timeMult := s.calculateTimeMultiplier(violationTime, activeRule.TimeMultipliers)

	repeatCount, err := s.repo.CountUnpaidViolationsLast90Days(licensePlate, violationTime)
	if err != nil {
		return nil, fmt.Errorf("failed to count prior violations: %w", err)
	}

	repeatMult := s.calculateRepeatMultiplier(repeatCount, activeRule.RepeatMultipliers)

	totalFine := baseAmount * timeMult * repeatMult

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

func (s *Service) calculateTimeMultiplier(violationTime time.Time, multipliers []rules.TimeMultiplier) float64 {
	vtStr := violationTime.Format("15:04")

	for _, tm := range multipliers {
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

	return 1.0 
}

func (s *Service) calculateRepeatMultiplier(count int, repeatMultipliers map[string]float64) float64 {
	key := fmt.Sprintf("%d", count)
	if mult, exists := repeatMultipliers[key]; exists {
		return mult
	}

	if count >= 2 {
		if mult, exists := repeatMultipliers["2+"]; exists {
			return mult
		}
	}

	return 1.0 
}
