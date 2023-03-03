package logger

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var logger *zap.Logger
var sugar *zap.SugaredLogger

func Create() *zap.SugaredLogger {
	logger, _ := zap.NewDevelopment()
	sugar := logger.Sugar()
	return sugar
}

func Init() {
	config := zap.NewDevelopmentConfig()
	config.Level = zap.NewAtomicLevelAt(zapcore.DebugLevel)
	logger, err := config.Build(zap.AddCallerSkip(1))
	if err != nil {
		panic(err)
	}
	sugar = logger.Sugar()
}

func Debugf(template string, args ...interface{}) {
	sugar.Debugf(template, args...)
}
func Infof(template string, args ...interface{}) {
	sugar.Infof(template, args...)
}
func Warnf(template string, args ...interface{}) {
	sugar.Warnf(template, args...)
}
func Errorf(template string, args ...interface{}) {
	sugar.Errorf(template, args...)
}

func Debug(args ...interface{}) {
	sugar.Debug(args...)
}
func Info(args ...interface{}) {
	sugar.Info(args...)
}
func Warn(args ...interface{}) {
	sugar.Warn(args...)
}
func Error(args ...interface{}) {
	sugar.Error(args...)
}

func Debugln(args ...interface{}) {
	sugar.Debugln(args...)
}
func Infoln(args ...interface{}) {
	sugar.Infoln(args...)
}
func Warnln(args ...interface{}) {
	sugar.Warnln(args...)
}
func Errorln(args ...interface{}) {
	sugar.Errorln(args...)
}
