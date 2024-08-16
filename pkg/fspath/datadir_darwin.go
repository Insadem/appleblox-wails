package fspath

var DataDir = New(func() (string, error) {
	p, err := HomeDir.Get()
	if err != nil {
		return "", err
	}

	return p + "/Library/Application Support", nil
})
