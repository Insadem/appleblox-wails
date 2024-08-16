package primitives

type Request[T any] struct {
	FuncID string
	Params T
}
