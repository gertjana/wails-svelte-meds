package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
)

func (a *App) AddUser(name string) {
	_, err := os.Stat(getFileLocation(name))
	if os.IsNotExist(err) {
		currentUser = name
		file, _ := json.MarshalIndent(make([]Medication, 0), "", " ")
		_ = ioutil.WriteFile(getFileLocation(name), file, 0644)
	}
	a.Load()
}

func (a *App) SetUser(name string) {
	currentUser = name
	a.Load()
}

func (a *App) GetUser() string {
	return currentUser
}

var r, _ = regexp.Compile(`medications.(.*).json`)

func (a *App) GetUsers() []string {
	userdir, _ := os.UserHomeDir()
	files, _ := ioutil.ReadDir(fmt.Sprintf("%s/.meds", userdir))
	var users []string
	for _, file := range files {
		// fmt.Println(file.Name())
		if r.MatchString(file.Name()) {
			users = append(users, r.FindStringSubmatch(file.Name())[1])
		}
	}
	return users
}
