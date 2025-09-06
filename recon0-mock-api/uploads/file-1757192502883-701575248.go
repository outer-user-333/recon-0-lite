package main

import "fmt"

func main() {
	fmt.Println("Welcome to maps tutorial in go-lang")

	languages := make(map[string]string)

	languages["JS"] = "javascript"
	languages["PY"] = "Python"
	languages["RB"] = "Ruby"

	fmt.Println("List of languages : ", languages)
	fmt.Println("JS full form : ", languages["JS"])

	// delete element using delete function
	// use in slice also

	delete(languages, "RB")
	fmt.Println("Updated list of languages : ", languages)

	languages["RT"] = "Rust"
	languages["JV"] = "Java"
	languages["GO"] = "Go-lang"

	// looping over the map

	for key, value := range languages {

		fmt.Printf("For key %v value is %v \n", key, value)

	}

	// %T - for type
	// %v - for value

}
