package payments

import "sync"

type InMemoryRepository struct {
	mu       sync.Mutex
	payments []*Payment
	nextID   int
}

func NewRepository() *InMemoryRepository {
	return &InMemoryRepository{
		payments: make([]*Payment, 0),
		nextID:   1,
	}
}

func (r *InMemoryRepository) Save(p *Payment) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if p.ID == 0 {
		p.ID = r.nextID
		r.nextID++
		r.payments = append(r.payments, p)
	} else {
		for i, existing := range r.payments {
			if existing.ID == p.ID {
				r.payments[i] = p
				break
			}
		}
	}
	return nil
}
