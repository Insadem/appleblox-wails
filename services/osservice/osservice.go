package osservice

import (
	"appleblox/pkg/execcmd"
	"os"
	"runtime"
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
	cmd := execcmd.ExecCommand(command, (*execcmd.Config)(config))
	o, err := execcmd.CombinedOutput(cmd)

	var txtout, txterr string
	if err != nil {
		txterr = err.Error()
	}
	txtout = string(o)

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
