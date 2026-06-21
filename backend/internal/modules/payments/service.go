package payments

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

// Service handles business logic for payments
type Service struct {
	repo PaymentRepository
}

// NewService creates a new Payments Service
func NewService(repo PaymentRepository) *Service {
	return &Service{
		repo: repo,
	}
}

// Charge processes a payment based on a mock scenario
func (s *Service) Charge(violationID int, amount float64, scenario string) (*Payment, error) {
	payment := &Payment{
		ViolationID:     violationID,
		Amount:          amount,
		PaymentScenario: scenario,
		CreatedAt:       time.Now(),
	}

	// Mock Gateway Processing
	if scenario == "success" {
		payment.Status = "paid"
		payment.TransactionID = fmt.Sprintf("txn_%s", uuid.New().String()[:8])
	} else if scenario == "failed" {
		payment.Status = "failed"
		payment.TransactionID = "" // No transaction ID for failed payments
	} else {
		return nil, fmt.Errorf("invalid payment scenario: %s (must be 'success' or 'failed')", scenario)
	}

	// Save to database
	err := s.repo.Save(payment)
	if err != nil {
		return nil, fmt.Errorf("failed to save payment record: %w", err)
	}

	return payment, nil
}
