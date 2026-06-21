package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"parking_violation_portal/internal/modules/payments"
	"parking_violation_portal/internal/modules/rules"
	"parking_violation_portal/internal/modules/violations"
)

func main() {
	router := gin.Default()

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	rulesRepo := rules.NewRepository()
	
	violationsRepo := violations.NewRepository()
	violationsService := violations.NewService(violationsRepo, rulesRepo)
	
	paymentsRepo := payments.NewRepository()
	paymentsService := payments.NewService(paymentsRepo, violationsRepo)

	rulesHandler := rules.NewHandler(rulesRepo)
	violationsHandler := violations.NewHandler(violationsService, violationsRepo)
	paymentsHandler := payments.NewHandler(paymentsService)

	api := router.Group("/api")
	{
		rulesGroup := api.Group("/rules")
		{
			rulesGroup.PUT("", rulesHandler.UpdateRules)
			rulesGroup.GET("/active", rulesHandler.GetActiveRule)
			rulesGroup.GET("/ping", func(c *gin.Context) { c.JSON(200, gin.H{"message": "pong"}) })
		}

		violationsGroup := api.Group("/violations")
		{
			violationsGroup.POST("", violationsHandler.SubmitViolation)
			violationsGroup.GET("/:license_plate", violationsHandler.GetViolationsByPlate)
		}

		paymentsGroup := api.Group("/payments")
		{
			paymentsGroup.POST("", paymentsHandler.ProcessPayment)
		}

		api.GET("/transactions", violationsHandler.GetHistory)
	}

	port := ":8080"
	log.Printf("Starting Parking Violation Portal API Gateway on port %s...", port)
	if err := router.Run(port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
