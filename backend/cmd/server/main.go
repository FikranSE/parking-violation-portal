package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize the Gin router
	router := gin.Default()

	// Apply global middleware (CORS, logging, recovery)
	// router.Use(middleware.CORS())

	// Initialize dependencies (DB connection, Repositories, Services)
	// db := database.Connect()
	// rulesRepo := rules.NewRepository(db)
	// rulesService := rules.NewService(rulesRepo)
	// violationsRepo := violations.NewRepository(db)
	// violationsService := violations.NewService(violationsRepo, rulesService)
	// paymentsRepo := payments.NewRepository(db)
	// paymentsService := payments.NewService(paymentsRepo)

	// Set up the API group
	api := router.Group("/api")
	{
		// Rules endpoints
		rulesGroup := api.Group("/rules")
		{
			// rulesHandler := rules.NewHandler(rulesService)
			// rulesGroup.PUT("", rulesHandler.UpdateRules)
			// rulesGroup.GET("/active", rulesHandler.GetActiveRule)
			rulesGroup.GET("/ping", func(c *gin.Context) { c.JSON(200, gin.H{"message": "pong"}) }) // placeholder
		}

		// Violations endpoints
		violationsGroup := api.Group("/violations")
		{
			// violationsHandler := violations.NewHandler(violationsService)
			// violationsGroup.POST("", violationsHandler.SubmitViolation)
			// violationsGroup.GET("/:license_plate", violationsHandler.GetViolationsByPlate)
		}

		// Payments endpoints
		paymentsGroup := api.Group("/payments")
		{
			// paymentsHandler := payments.NewHandler(paymentsService)
			// paymentsGroup.POST("", paymentsHandler.ProcessPayment)
		}

		// Transactions history endpoint
		api.GET("/transactions", func(c *gin.Context) {
			// transactionsHandler.GetHistory(c)
		})
	}

	// Start the server
	port := ":8080"
	log.Printf("Starting Parking Violation Portal API Gateway on port %s...", port)
	if err := router.Run(port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
