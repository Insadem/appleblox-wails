package osservice

import "testing"

func TestExecuteCommand(t *testing.T) {
	os := &OSService{}

	// Empty command test
	command := ``
	r := os.ExecCommand(command, nil)
	if r.StdOut != "" || r.StdErr != "" {
		t.Error("expected that both std are empty")
	}

	// Default test
	command = `echo test`
	r = os.ExecCommand(command, nil)
	if r.StdOut != "test\n" {
		t.Error("expected stdout to equal test")
	}

	// Pipe test
	command = `echo "2 + 2" | bc`
	r = os.ExecCommand(command, nil)
	if r.StdOut != "4\n" {
		t.Error("expected stdout to equal 4")
	}

	// Error test
	command = `none`
	r = os.ExecCommand(command, nil)
	if r.StdOut != "" || r.StdErr == "" {
		t.Error("expected stderr to be non empty")
	}

	// Background test
	command = `none`
	r = os.ExecCommand(command, &Config{
		Background: true,
	})
	if r.StdOut != "" || r.StdErr != "" {
		t.Error("expected that both std are empty")
	}
}
