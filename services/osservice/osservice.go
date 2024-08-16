package osservice

import (
	"os"
	"os/exec"
	"runtime"
	"strings"
)

type OSService struct{}

type Config struct {
	Background bool `json:"background"`
}

type ExecResult struct {
	Pid      int    `json:"pid"`
	StdOut   string `json:"stdOut"`
	StdErr   string `json:"stdErr"`
	ExitCode int    `json:"exitCode"`
}

func (s *OSService) ExecCommand(command string, config *Config) ExecResult {
	// Split the command into parts
	args := strings.Fields(command)
	if len(args) == 0 {
		return ExecResult{}
	}

	var cmd *exec.Cmd

	// Check if the command contains pipes
	if strings.Contains(command, "|") {
		// If pipes are present, use bash to execute the full command
		cmd = exec.Command("bash", "-c", command)
	} else {
		cmd = exec.Command(args[0], args[1:]...)
	}

	var txtout, txterr string

	if config == nil || !config.Background { // Does wait for command to finish
		b, err := cmd.CombinedOutput()
		if err != nil {
			txterr = err.Error()
		} else {
			txtout = string(b)
		}
	} else { // Doesn't wait for command to finish
		cmd.Start()
	}

	if cmd.Process == nil {
		cmd.Process = &os.Process{}
	}

	return ExecResult{
		Pid:      cmd.Process.Pid,
		StdOut:   txtout,
		StdErr:   txterr,
		ExitCode: cmd.ProcessState.ExitCode(),
	}
}

func (s *OSService) Arm() bool {
	if runtime.GOARCH == "arm64" {
		return true
	} else {
		return false
	}
}
