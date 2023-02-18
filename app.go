package main

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"os"
  // "fmt"
)

// App struct
type App struct {
	ctx context.Context
}

type Medication struct {
	Name   string  `json:"name"`
	Amount float64 `json:"amount"`
	Unit   string  `json:"unit"`
	Dosage float64 `json:"dosage"`
	Stock  float64 `json:"stock"`
  LastUpdated string `json:"last_updated"`
}

var medications = make(map[string][]Medication, 0)

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.Load()
}

func (a *App) Load() {
	file, _ := ioutil.ReadFile(getFileLocation())

	_ = json.Unmarshal([]byte(file), &medications)
}

func (a *App) Save(meds []Medication, name string) {
  medications[name] = meds

	file, _ := json.MarshalIndent(medications, "", " ")
	_ = ioutil.WriteFile(getFileLocation(), file, 0644)
}

func (a *App) GetNames() []string {
	names := make([]string, 0)
	for name := range medications {
		names = append(names, name)
	}
	return names
}

func (a *App) Medications(name string) []Medication {
	return medications[name]
}

func (a *App) UpdateStock(name string, med_name string, stock float64, date string) {
	for i, med := range medications[name] {
		if med.Name == med_name {
			medications[name][i].Stock = stock
      medications[name][i].LastUpdated = date
		}
	}
}

func getFileLocation() string {
	file_location, _ := os.UserHomeDir()
	return file_location+ "/.meds/medications.json"
}
