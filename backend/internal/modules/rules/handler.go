package rules

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	// Normally you'd have a rules.Service here
	// service *Service
}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) UpdateRules(c *gin.Context) {
	var input struct {
		BaseAmounts       map[string]float64 `json:"base_amounts" binding:"required"`
		TimeMultipliers   []TimeMultiplier   `json:"time_multipliers" binding:"required"`
		RepeatMultipliers map[string]float64 `json:"repeat_multipliers" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Mock logic: generate a new rule version
	newRule := FineRule{
		ID:                2, // mock ID
		Version:           2, // mock version
		EffectiveFrom:     time.Now(),
		BaseAmounts:       input.BaseAmounts,
		TimeMultipliers:   input.TimeMultipliers,
		RepeatMultipliers: input.RepeatMultipliers,
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Fine rules updated successfully",
		"rule":    newRule,
	})
}
