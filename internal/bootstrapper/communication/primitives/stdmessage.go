package primitives

// StdMessage is json parsed from std(in/out)
type StdMessage struct {
	UUID string `json:"uuid"`
	Type string `json:"type"`
}
