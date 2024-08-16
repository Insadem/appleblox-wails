package fsservice

import (
	"os"
	"time"
)

type FSService struct {
}

type Stats struct {
	Size        int64 `json:"size"`
	IsFile      bool  `json:"isFile"`
	IsDirectory bool  `json:"isDirectory"`
	CreatedAt   int64 `json:"createdAt"`
	ModifiedAt  int64 `json:"modifiedAt"`
}

// GetStats returns file statistics for the given path. If the given path doesn't exist or is inaccessible, error is thrown.
func (s *FSService) GetStats(path string) (Stats, error) {
	v, err := os.Stat(path)
	if err != nil {
		return Stats{}, err
	}

	// File creation date is not implemented in golang, so we use 1970 year as a creation date
	n := time.Now()
	// Get the Unix epoch time (January 1, 1970 at midnight UTC)
	e := time.Unix(0, 0).UTC()
	// Calculate the duration since the Unix epoch
	d := n.Sub(e).Milliseconds()

	return Stats{
		Size:        v.Size(),
		IsFile:      !v.IsDir(),
		IsDirectory: v.IsDir(),
		CreatedAt:   d,
		ModifiedAt:  v.ModTime().UnixMilli(),
	}, nil
}

// CreateDirectory creates a directory or multiple directories recursively.
func (s *FSService) CreateDirectory(path string) error {
	return os.MkdirAll(path, 0755)
}

// Remove removes a directory or file. If the given path is a directory, this function recursively removes all contents of the specific directory.
func (s *FSService) Remove(path string) error {
	return os.RemoveAll(path)
}

// ReadFile reads a text file.
func (s *FSService) ReadFile(path string) (string, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}

	return string(b), nil
}

// Copy copies a file or directory to a new destination.
func (s *FSService) Copy(src string, dst string) error {
	r, err := os.Open(src)
	if err != nil {
		return err
	}
	defer r.Close()

	w, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer w.Close()

	_, err = w.ReadFrom(r)
	if err != nil {
		return err
	}

	return nil
}

// AppendFile appends text content to file. Returns error if file doesn't exist.
func (s *FSService) AppendFile(path string, data string) error {
	// If the file doesn't exist, create it, or append to the file
	f, err := os.OpenFile(path, os.O_APPEND|os.O_WRONLY, 0755)
	if err != nil {
		return err
	}
	defer f.Close()

	if _, err := f.Write([]byte(data)); err != nil {
		return err
	}

	return nil
}

// WriteFile writes a text file.
func (s *FSService) WriteFile(path string, data string) error {
	return os.WriteFile(path, []byte(data), 0755)
}
