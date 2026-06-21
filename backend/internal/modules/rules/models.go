package rules

import (
	"time"
)

// FineRule represents a versioned fine calculation rule
type FineRule struct {
	ID                int                    `json:"id"`
	Version           int                    `json:"version"`
	EffectiveFrom     time.Time              `json:"effective_from"`
	EffectiveTo       *time.Time             `json:"effective_to,omitempty"`
	BaseAmounts       map[string]float64     `json:"base_amounts"`
	TimeMultipliers   []TimeMultiplier       `json:"time_multipliers"`
	RepeatMultipliers map[string]float64     `json:"repeat_multipliers"`
}

// TimeMultiplier defines a multiplier based on the time of day
type TimeMultiplier struct {
	StartTime  string  `json:"start_time"` // Format: "HH:MM"
	EndTime    string  `json:"end_time"`   // Format: "HH:MM"
	Multiplier float64 `json:"multiplier"`
}

// RuleService interface abstracts fetching rules
type RuleService interface {
	GetActiveRule() (*FineRule, error)
}
