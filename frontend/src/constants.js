export const LANGUAGE_VERSIONS = {
    javascript: "18.15.0",
    java: "15.0.2",
    csharp: "6.12.0",
    python: "3.10.0",
    c: "10.2.0",
    cpp: "10.2.0",
}

export const CODE_SNIPPETS = {
    javascript: `// JavaScript Example
  function greet(name) {
    return \`Hello, \${name}!\`;
  }
  console.log(greet("World"));`,
  
    java: `// Java Example
  public class Main {
    public static void main(String[] args) {
      System.out.println("Hello, World!");
    }
  }`,
  
    csharp: `// C# Example
  using System;
  
  class Program {
    static void Main() {
      Console.WriteLine("Hello, World!");
    }
  }`,
  
    python: `# Python Example
  def greet(name):
      return f"Hello, {name}!"
  
  print(greet("World"))`,
  
    c: `// C Example
  #include <stdio.h>
  
  int main() {
      printf("Hello, World!\\n");
      return 0;
  }`,
  
    cpp: `// C++ Example
  #include <iostream>
  
  int main() {
      std::cout << "Hello, World!" << std::endl;
      return 0;
  }`
  };