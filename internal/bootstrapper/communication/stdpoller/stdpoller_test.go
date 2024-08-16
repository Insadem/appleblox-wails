package stdpoller

import (
	"bufio"
	"os"
	"testing"
	"time"
)

func TestPoll(t *testing.T) {
	scanner := bufio.NewScanner(os.Stdout)

	// TODO: instead of poller use std catcher, why not?
	go func() {
		time.Sleep(time.Millisecond * 2500)
		os.Stdout.WriteString("Test\n")
		os.Stdout.WriteString("Test\n")
		os.Stdout.WriteString("Test\n")
	}()

	for scanner.Scan() {
		message := scanner.Text()
		if message != "Test" {
			t.Error("line value isn't expected")
		}
	}

	if err := scanner.Err(); err != nil {
		t.Error(err)
	}
}
