package violations

import (
	"time"
)

// Violation represents a parking violation
type Violation struct {
	ID             int       `json:"id"`
	LicensePlate   string    `json:"license_plate"`
	ViolationType  string    `json:"violation_type"`
	Location       string    `json:"location"`
	ViolationTime  time.Time `json:"violation_time"`
	PhotoURL       string    `json:"photo_url"`
	RuleVersionID  int       `json:"rule_version_id"`
	CalculatedFine float64   `json:"calculated_fine"`
	Status         string    `json:"status"` // "UNPAID", "PAID"
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// ViolationRepository abstracts database operations for violations
type ViolationRepository interface {
	CountUnpaidViolationsLast90Days(licensePlate string, before time.Time) (int, error)
	Save(v *Violation) error
}
