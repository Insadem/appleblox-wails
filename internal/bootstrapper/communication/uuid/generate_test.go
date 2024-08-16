package uuid

import "testing"

func TestGenerate(t *testing.T) {
	uuid := generate()
	if uuid == "" {
		t.Error("expected to be non empty string")
	}
}
