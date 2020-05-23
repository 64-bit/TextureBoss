#pragma once
#include <string>

class Window
{
public:

	virtual void OnOpen();

	virtual void OnFrame(float deltaT) = 0;

	virtual void Close();

	virtual bool IsClosed();

protected:

	 bool _isClosed = false;
	 long _windowID;
	 static long _nextWindowID;
};
