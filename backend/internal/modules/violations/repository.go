package violations

import (
	"sync"
	"time"
)

type InMemoryRepository struct {
	mu         sync.RWMutex
	violations []*Violation
	nextID     int
}

func NewRepository() *InMemoryRepository {
	return &InMemoryRepository{
		violations: make([]*Violation, 0),
		nextID:     1,
	}
}

func (r *InMemoryRepository) CountUnpaidViolationsLast90Days(licensePlate string, before time.Time) (int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	count := 0
	ninetyDaysAgo := before.Add(-90 * 24 * time.Hour)

	for _, v := range r.violations {
		if v.LicensePlate == licensePlate && v.Status == "UNPAID" && v.ViolationTime.After(ninetyDaysAgo) && v.ViolationTime.Before(before) {
			count++
		}
	}
	return count, nil
}

func (r *InMemoryRepository) Save(v *Violation) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if v.ID == 0 {
		v.ID = r.nextID
		r.nextID++
		r.violations = append(r.violations, v)
	} else {
		for i, existing := range r.violations {
			if existing.ID == v.ID {
				r.violations[i] = v
				break
			}
		}
	}
	return nil
}

func (r *InMemoryRepository) GetByPlate(licensePlate string) ([]*Violation, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*Violation
	for _, v := range r.violations {
		if v.LicensePlate == licensePlate {
			result = append(result, v)
		}
	}
	return result, nil
}

func (r *InMemoryRepository) GetAll() ([]*Violation, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	
	result := make([]*Violation, len(r.violations))
	copy(result, r.violations)
	return result, nil
}

func (r *InMemoryRepository) UpdateStatus(id int, status string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	for _, v := range r.violations {
		if v.ID == id {
			v.Status = status
			return nil
		}
	}
	return nil
}
