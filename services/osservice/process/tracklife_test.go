package process

import (
	"appleblox/pkg/execcmd"
	"syscall"
	"testing"
	"time"
)

func TestTrackLife(t *testing.T) {
	const d time.Duration = time.Millisecond * 250

	cmd := execcmd.ExecCommand("sleep 9999", &execcmd.Config{
		Background: true,
	})
	time.Sleep(d)

	_, err := execcmd.CombinedOutput(cmd)
	if err != nil {
		t.Error(err)
		return
	}

	p := cmd.Process
	if p == nil {
		t.Error("process is nil")
		return
	}

	n := time.Now()
	go func() {
		time.Sleep(d)
		p.Release()
	}()

	c := trackLife(p)
	<-c

	if time.Since(n) < d {
		t.Error("expected to wait not less than waitTimeInSec")
		return
	}

	err = p.Signal(syscall.Signal(0)) // err is nil if process exist
	if err == nil {
		t.Error("expected process to exit")
	}
}
