cmake_minimum_required(VERSION 3.10)
project(NaryTreeLocking VERSION 1.0 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Compiler flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra")
set(CMAKE_CXX_FLAGS_DEBUG "-g -DDEBUG")
set(CMAKE_CXX_FLAGS_RELEASE "-O3 -DNDEBUG")

# Find Threads package for pthread
find_package(Threads REQUIRED)

# Source files
set(SOURCES
    main.cpp
    nary_tree_lock.cpp
)

set(HEADERS
    nary_tree_lock.h
)

# Create executable
add_executable(tree_lock ${SOURCES} ${HEADERS})

# Link pthread
target_link_libraries(tree_lock PRIVATE Threads::Threads)

# Include directories
target_include_directories(tree_lock PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})

# Enable testing
enable_testing()
add_test(NAME TreeLockTests COMMAND tree_lock)

# Installation
install(TARGETS tree_lock DESTINATION bin)

# Print configuration
message(STATUS "")
message(STATUS "====================================")
message(STATUS "N-ary Tree Locking Algorithm")
message(STATUS "====================================")
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")
message(STATUS "C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "Compiler: ${CMAKE_CXX_COMPILER}")
message(STATUS "====================================")
message(STATUS "")
