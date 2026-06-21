package payments

import (
	"fmt"
	"time"

	"github.com/google/uuid"

	"parking_violation_portal/internal/modules/violations"
)

type Service struct {
	repo           *InMemoryRepository
	violationsRepo *violations.InMemoryRepository
}

func NewService(repo *InMemoryRepository, vRepo *violations.InMemoryRepository) *Service {
	return &Service{repo: repo, violationsRepo: vRepo}
}

func (s *Service) ProcessPayment(violationID int, amount float64, scenario string) (*Payment, error) {
	payment := &Payment{
		ViolationID:     violationID,
		Amount:          amount,
		PaymentScenario: scenario,
		CreatedAt:       time.Now(),
	}

	if scenario == "success" {
		payment.Status = "paid"
		payment.TransactionID = fmt.Sprintf("txn_%s", uuid.New().String()[:8])
	} else if scenario == "failed" {
		payment.Status = "failed"
		payment.TransactionID = "" 
	} else {
		return nil, fmt.Errorf("invalid payment scenario: %s (must be 'success' or 'failed')", scenario)
	}

	if err := s.repo.Save(payment); err != nil {
		return nil, err
	}

	if payment.Status == "paid" {
		s.violationsRepo.UpdateStatus(violationID, "PAID")
	}

	return payment, nil
}
