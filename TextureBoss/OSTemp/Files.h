#pragma once

struct File
{
public:

	File(const int length, const char* data);
	~File();

	//File(const File&) = delete;
	//File(File&&);


	const int Length;
	const char* Data;
};

class FileSystem
{
public:
	static File Open(const char* filename, bool readAsText);
};