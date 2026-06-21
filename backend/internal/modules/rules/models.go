package rules

import (
	"time"
)

type FineRule struct {
	ID                int                    `json:"id"`
	Version           int                    `json:"version"`
	EffectiveFrom     time.Time              `json:"effective_from"`
	EffectiveTo       *time.Time             `json:"effective_to,omitempty"`
	BaseAmounts       map[string]float64     `json:"base_amounts"`
	TimeMultipliers   []TimeMultiplier       `json:"time_multipliers"`
	RepeatMultipliers map[string]float64     `json:"repeat_multipliers"`
}

type TimeMultiplier struct {
	StartTime  string  `json:"start_time"` 
	EndTime    string  `json:"end_time"`   
	Multiplier float64 `json:"multiplier"`
}

type RuleService interface {
	GetActiveRule() (*FineRule, error)
}
