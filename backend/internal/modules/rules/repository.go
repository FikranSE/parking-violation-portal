package rules

import "time"

type InMemoryRepository struct {
	activeRule *FineRule
}

func NewRepository() *InMemoryRepository {
	return &InMemoryRepository{
		activeRule: &FineRule{
			ID:      1,
			Version: 1,
			EffectiveFrom: time.Now(),
			BaseAmounts: map[string]float64{
				"expired_meter":    50000,
				"no_parking_zone":  150000,
				"blocking_hydrant": 250000,
				"disabled_spot":    500000,
			},
			TimeMultipliers: []TimeMultiplier{
				{StartTime: "06:00", EndTime: "22:00", Multiplier: 1.0},
				{StartTime: "22:00", EndTime: "06:00", Multiplier: 1.5},
			},
			RepeatMultipliers: map[string]float64{
				"0":  1.0,
				"1":  1.5,
				"2+": 2.0,
			},
		},
	}
}


func (r *InMemoryRepository) GetActiveRule() (*FineRule, error) {
	return r.activeRule, nil
}
