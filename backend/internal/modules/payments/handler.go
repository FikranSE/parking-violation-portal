package payments

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) ProcessPayment(c *gin.Context) {
	var input struct {
		ViolationID int     `json:"violation_id" binding:"required"`
		Amount      float64 `json:"amount" binding:"required"`
		Scenario    string  `json:"scenario" binding:"required,oneof=success failed"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	payment, err := h.service.Charge(input.ViolationID, input.Amount, input.Scenario)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if payment.Status == "failed" {
		c.JSON(http.StatusPaymentRequired, gin.H{
			"message": "Payment failed",
			"payment": payment,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Payment successful",
		"payment": payment,
	})
}
