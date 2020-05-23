#include "Files.h"
#include <stdio.h>
#include <cstring>

File::File(const int length, const char* data)
	: Length(length), Data(data)
{

}

File::~File()
{
	delete[] Data;
}

const char* concatStrings(const char* a, const char *b)
{
	int lenA = strlen(a);
	int lenB = strlen(b);

	char* result = new char[lenA + lenB + 1];
	char* writePtr = result;

	memcpy(writePtr, a, lenA);
	writePtr += lenA;
	memcpy(writePtr, b, lenB);
	writePtr += lenB;

	*writePtr = 0;//append null byte
	return result;
}

File FileSystem::Open(const char* filename, bool readAsText)
{
	auto path = concatStrings("Resources/", filename);

	FILE* fileHandle = fopen(path, "rb");

	fseek(fileHandle, 0L, SEEK_END);
	const size_t fileSize = +(size_t)(ftell(fileHandle) + (readAsText ? 1 : 0));
	fseek(fileHandle, 0L, SEEK_SET);

	char* fileData = new char[fileSize];

	if (readAsText)
	{
		fread(fileData, 1, fileSize - 1, fileHandle);
		fileData[fileSize - 1] = 0;//Append null byte if reading in text mode
	}
	else
	{
		fread(fileData, 1, fileSize, fileHandle);
	}

	fclose(fileHandle);
	delete[] path;
	return File((int)fileSize, fileData);
}
