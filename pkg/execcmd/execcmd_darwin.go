package execcmd

import (
	"bytes"
	"io"
	"os/exec"
	"strings"
)

type Config struct {
	Background bool   `json:"background"`
	Directory  string `json:"directory"`
	Stdout     io.Writer
	Stderr     io.Writer
}

func ExecCommand(command string, conf *Config) *exec.Cmd {
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

	if conf != nil {
		cmd.Dir = conf.Directory // Set current working directory.
		cmd.Stdout = conf.Stdout
		cmd.Stderr = conf.Stderr
	}

	// Set default std if empty
	if cmd.Stdout == nil {
		cmd.Stdout = new(bytes.Buffer)
	}
	if cmd.Stderr == nil {
		cmd.Stderr = new(bytes.Buffer)
	}

	var err error
	if conf == nil || !conf.Background { // Does wait for command to finish
		err = cmd.Run()
	} else { // Doesn't wait for command to finish
		err = cmd.Start()
	}

	if err != nil { // Try write err to buffer if stderr is empty.
		b := make([]byte, 2)
		r, ok := cmd.Stderr.(io.Reader)
		if ok {
			r.Read(b)
			if b[0] == 0 && b[1] == 0 { // There isn't any previous error in buffer, because byte has default value.
				cmd.Stderr.Write([]byte(err.Error()))
			}
		}
	}

	return cmd
}
