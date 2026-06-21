package violations

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) SubmitViolation(c *gin.Context) {
	var input struct {
		LicensePlate  string    `json:"license_plate" binding:"required"`
		ViolationType string    `json:"violation_type" binding:"required"`
		Location      string    `json:"location" binding:"required"`
		ViolationTime time.Time `json:"violation_time" binding:"required"`
		PhotoURL      string    `json:"photo_url"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	violation, err := h.service.ProcessNewViolation(
		input.LicensePlate,
		input.ViolationType,
		input.Location,
		input.PhotoURL,
		input.ViolationTime,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":   "Violation submitted successfully",
		"violation": violation,
	})
}

// GetHistory returns a list of all violations and their rule versions (mock implementation)
func (h *Handler) GetHistory(c *gin.Context) {
	// In a real application, you would fetch this from a transactions or violations view/repo
	// that joins with rules and payments.
	c.JSON(http.StatusOK, gin.H{
		"message": "Transaction history fetched successfully",
		"data": []gin.H{
			{
				"violation_id":    1,
				"license_plate":   "B1234XYZ",
				"violation_type":  "expired_meter",
				"calculated_fine": 50000,
				"status":          "PAID",
				"rule_version_id": 1,
				"payment_status":  "SUCCESS",
			},
		},
	})
}
