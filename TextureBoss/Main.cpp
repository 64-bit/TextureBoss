// TextureBoss.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include "pch.h"
#include <iostream>
#include "glad/include/glad/glad.h"
#include <GLFW\glfw3.h>

#include "imgui/imgui_impl_glfw.h"
#include "imgui/imgui_impl_opengl3.h"

#include "imnodes/imnodes.h"
#include "TextureBoss.h"

#include "mathfu/glsl_mappings.h"


static int _viewportWidth;
static int _viewportHeight;

void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	_viewportWidth = width;
	_viewportHeight = height;
	glViewport(0, 0, width, height);
}

void processInput(GLFWwindow *window)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
		glfwSetWindowShouldClose(window, true);
}

void setImGuiStyle(float highDPIscaleFactor)
{
	ImGuiStyle &style = ImGui::GetStyle();

	style.WindowRounding = 0.0f;

	// ...

	style.ScaleAllSizes(highDPIscaleFactor);
}

static bool _shouldQuit = false;

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	float highDPIscaleFactor = 1.0;
#ifdef _WIN32
	// if it's a HighDPI monitor, try to scale everything
	GLFWmonitor *monitor = glfwGetPrimaryMonitor();
	float xscale, yscale;
	glfwGetMonitorContentScale(monitor, &xscale, &yscale);
	if (xscale > 1 || yscale > 1)
	{
		highDPIscaleFactor = xscale;
		glfwWindowHint(GLFW_SCALE_TO_MONITOR, GLFW_TRUE);
	}
#endif

	GLFWwindow* window = glfwCreateWindow(800, 600, "TextureBoss V0.1", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	glViewport(0, 0, 800 * highDPIscaleFactor, 600 * highDPIscaleFactor);
	_viewportWidth = 800 * highDPIscaleFactor;
	_viewportHeight = 600 * highDPIscaleFactor;
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

	// Setup Dear ImGui context
	IMGUI_CHECKVERSION();
	ImGui::CreateContext();
	ImGuiIO& io = ImGui::GetIO(); (void)io;

	ImGui::StyleColorsDark();

	const char* glsl_version = "#version 150";

	ImGui_ImplGlfw_InitForOpenGL(window, true);
	ImGui_ImplOpenGL3_Init(glsl_version);

	imnodes::Initialize();

	bool show_another_window = true;

	ImFont* mainFont = io.Fonts->AddFontFromFileTTF("Resources/Fonts/Electrolize-Regular.ttf", 20.0f * highDPIscaleFactor);
	setImGuiStyle(highDPIscaleFactor);

	TextureBoss* LikeABoss = new TextureBoss();
	LikeABoss->Init();

	double lastFrame = glfwGetTime();

	while (!glfwWindowShouldClose(window) && !_shouldQuit)
	{
		processInput(window);

		glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT);

		ImGui_ImplOpenGL3_NewFrame();
		ImGui_ImplGlfw_NewFrame();
		ImGui::NewFrame();

		const double currentTime = glfwGetTime();
		const double thisFrame = currentTime - lastFrame;
		lastFrame = currentTime;

		LikeABoss->OnFrameUI(thisFrame);

		glBindFramebuffer(GL_FRAMEBUFFER, 0);
		glViewport(0, 0, _viewportWidth, _viewportHeight);

		LikeABoss->OnFrameBackground(thisFrame);

		ImGui::Render();
		ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());

		glfwSwapBuffers(window);
		glfwPollEvents();
	}

	imnodes::Shutdown();

	glfwTerminate();
	return 0;
}