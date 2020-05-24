#pragma once

#include "UI/WindowManager.h"
//main application instance

class ShaderProgram;

class TextureBoss
{
public:

	void Init();

	void OnFrameUI(float deltaT);

	void OnFrameBackground(float deltaT);

private:

	void MenuBar();

	void DrawGLBackground(float deltaT);


	//managers

	WindowManager* _windowManager = nullptr;

	ShaderProgram* _backgroundShader = nullptr;

	bool _showDebugMenu;
};