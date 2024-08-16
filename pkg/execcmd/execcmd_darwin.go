package execcmd

import (
	"bytes"
	"os/exec"
	"strings"
)

type Config struct {
	Background bool `json:"background"`
}

func ExecCommand(command string, config *Config) *exec.Cmd {
	// Split the command into parts
	args := strings.Fields(command)
	if len(args) == 0 {
		return new(exec.Cmd)
	}

	var cmd *exec.Cmd

	// Check if the command contains pipes
	if strings.Contains(command, "|") {
		// If pipes are present, use bash to execute the full command
		cmd = exec.Command("bash", "-c", command)
	} else {
		cmd = exec.Command(args[0], args[1:]...)
	}
	var obuf, ebuf bytes.Buffer
	cmd.Stdout = &obuf // only pointer type of buffer implements io.Write interface
	cmd.Stderr = &ebuf

	if config == nil || !config.Background { // Does wait for command to finish
		err := cmd.Run()
		if err != nil && ebuf.Len() == 0 { // Write this err to buffer
			cmd.Stderr.Write([]byte(err.Error()))
		}
	} else { // Doesn't wait for command to finish
		cmd.Start()
	}

	return cmd
}
