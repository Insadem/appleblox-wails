package execcmd

import (
	"testing"
)

func TestExecCommand(t *testing.T) {
	// Empty command test
	command := ``
	cmd := ExecCommand(command, nil)
	o, err := CombinedOutput(cmd)
	if err != nil {
		t.Error("expected err to be nil")
	}

	if o != "" {
		t.Error("expected o to be empty")
	}

	// Error test
	command = `none`
	cmd = ExecCommand(command, nil)
	o, err = CombinedOutput(cmd)
	if err == nil {
		t.Error("expected err to be not nil")
	}

	if o != "" {
		t.Error("expected o to be empty")
	}

	// Default test
	command = `echo test`
	cmd = ExecCommand(command, nil)
	o, err = CombinedOutput(cmd)
	if err != nil {
		t.Error("expected err to be nil")
	}
	if o != "test\n" {
		t.Error("expected o to equal test")
	}

	// Pipe test
	command = `echo "2 + 2" | bc`
	cmd = ExecCommand(command, nil)
	o, err = CombinedOutput(cmd)
	if err != nil {
		t.Error("expected err to be nil")
	}
	if o != "4\n" {
		t.Error("expected stdout to equal 4")
	}

	// Background test
	command = `none`
	cmd = ExecCommand(command, &Config{
		Background: true,
	})
	o, err = CombinedOutput(cmd)
	if err != nil {
		t.Error("expected err to be nil")
	}
	if o != "" {
		t.Error("expected o to be empty")
	}
}
