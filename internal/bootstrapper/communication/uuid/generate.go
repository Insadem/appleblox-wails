package uuid

import (
	"crypto/rand"
	"fmt"
)

// generate returns uuid string or empty string
func generate() string {
	b := make([]byte, 16)

	_, err := rand.Read(b)
	if err != nil {
		return ""
	}

	return fmt.Sprintf("%X-%X-%X-%X-%X", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
}
