package rules

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	repo *InMemoryRepository
}

func NewHandler(repo *InMemoryRepository) *Handler {
	return &Handler{repo: repo}
}

func (h *Handler) GetActiveRule(c *gin.Context) {
	rule, err := h.repo.GetActiveRule()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch active rule"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Active rule fetched successfully",
		"rule":    rule,
	})
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

	current, _ := h.repo.GetActiveRule()
	newRule := FineRule{
		ID:                current.ID + 1,
		Version:           current.Version + 1,
		EffectiveFrom:     time.Now(),
		BaseAmounts:       input.BaseAmounts,
		TimeMultipliers:   input.TimeMultipliers,
		RepeatMultipliers: input.RepeatMultipliers,
	}
	h.repo.activeRule = &newRule

	c.JSON(http.StatusOK, gin.H{
		"message": "Fine rules updated successfully",
		"rule":    newRule,
	})
}
