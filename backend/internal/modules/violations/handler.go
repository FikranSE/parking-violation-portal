package violations

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
	repo    *InMemoryRepository
}

func NewHandler(service *Service, repo *InMemoryRepository) *Handler {
	return &Handler{service: service, repo: repo}
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

func (h *Handler) GetViolationsByPlate(c *gin.Context) {
	plate := c.Param("license_plate")
	violations, _ := h.repo.GetByPlate(plate)

	c.JSON(http.StatusOK, gin.H{
		"message": "Violations fetched successfully",
		"data":    violations,
	})
}

func (h *Handler) GetHistory(c *gin.Context) {
	violations, _ := h.repo.GetAll()

	c.JSON(http.StatusOK, gin.H{
		"message": "Transaction history fetched successfully",
		"data":    violations,
	})
}
