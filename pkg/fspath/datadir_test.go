package fspath

import (
	"os"
	"testing"
)

func TestDataDir(t *testing.T) {
	ddp, err := DataDir.Get()
	if err != nil {
		t.Error(err)
	}

	if _, err := os.Stat(ddp); os.IsNotExist(err) {
		t.Error(err)
	}
}
