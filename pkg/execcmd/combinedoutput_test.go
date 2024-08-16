package execcmd

import (
	"bytes"
	"os/exec"
	"testing"
)

func TestCombinedOutput(t *testing.T) {
	_, err := CombinedOutput(nil)
	if err == nil {
		t.Error("expected err to be not nil")
	}

	cmd := exec.Command("echo", "test")

	cmd.Stdout = new(bytes.Buffer)
	cmd.Stderr = new(bytes.Buffer)

	err = cmd.Run()
	if err != nil {
		t.Error("couldn't run cmd: %w", err)
	}

	o, err := CombinedOutput(cmd)
	if err != nil {
		t.Error("expected err to be nil")
	}

	if o != "test\n" {
		t.Error("expected o equal test")
	}

	cmd = exec.Command("ls", "$3jqksak")

	cmd.Stdout = new(bytes.Buffer)
	cmd.Stderr = new(bytes.Buffer)

	cmd.Run()
	o, err = CombinedOutput(cmd)
	if err == nil {
		t.Error("expected err to be not nil")
	}

	if o != "" {
		t.Error("expected o to be empty")
	}
}
