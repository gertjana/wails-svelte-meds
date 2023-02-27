package main

import (
	"context"
	"fmt"
	_ "image/png"
	"log"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

var medications []Medication = make([]Medication, 0)

var currentUser string

var unsaved = false

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

func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	if !unsaved {
		return false
	}
	dialog, err := runtime.MessageDialog(ctx, runtime.MessageDialogOptions{
		Type:          runtime.QuestionDialog,
		Title:         "Really want to quit?",
		Message:       "what about those changes you made>",
		Buttons:       []string{"Cancel", "Save", "Quit"},
		DefaultButton: "Save",
		CancelButton:  "Cancel",
	})
	if err != nil {
		return false
	}
	switch dialog {
	case "Quit":
		return false
	case "Save":
		log.Println("Saving...")
		a.Save(medications)
		return false
	}
	return true
}

func (a *App) MarkUnsaved(u bool) {
	unsaved = u
}

func getFileLocation(name string) string {
	userdir, _ := os.UserHomeDir()
	return fmt.Sprintf("%s/.meds/medications.%s.json", userdir, name)
}
