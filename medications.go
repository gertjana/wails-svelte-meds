package main

import (
	"encoding/json"
	"io/ioutil"
)

type Medication struct {
	Name        string  `json:"name"`
	Amount      float64 `json:"amount"`
	Unit        string  `json:"unit"`
	Dosage      float64 `json:"dosage"`
	Stock       float64 `json:"stock"`
	LastUpdated string  `json:"last_updated"`
}

func (a *App) Load() {
	file, _ := ioutil.ReadFile(getFileLocation(currentUser))

	_ = json.Unmarshal([]byte(file), &medications)
}

func (a *App) Save(meds []Medication, name string) {
	medications = meds

	file, _ := json.MarshalIndent(medications, "", " ")
	_ = ioutil.WriteFile(getFileLocation(currentUser), file, 0644)
}

func (a *App) Medications() []Medication {
	return medications
}

func (a *App) UpdateStock(name string, med_name string, stock float64, date string) {
	for i, med := range medications {
		if med.Name == med_name {
			medications[i].Stock = stock
			medications[i].LastUpdated = date
		}
	}
}
