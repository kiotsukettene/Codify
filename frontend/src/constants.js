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


export const CODING_CHALLENGES = [
  {
    id: 1,
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy",
    example: {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]" },
      { input: "[3,2,4], 6", expected: "[1,2]" },
      { input: "[3,3], 6", expected: "[0,1]" },
    ],
    status: "pending",
    starterCode: {
      javascript: `
        function twoSum(nums, target) {
          // Write your code here
          return [];
        }

        // Example usage:
        // console.log(twoSum([2, 7, 11, 15], 9)); // Output: [0, 1]
      `,
      java: `
        class Solution {
          public int[] twoSum(int[] nums, int target) {
            // Write your code here
            return new int[]{};
          }

          public static void main(String[] args) {
            Solution solution = new Solution();
            int[] nums = {2, 7, 11, 15};
            int target = 9;
            int[] result = solution.twoSum(nums, target);
            System.out.println(java.util.Arrays.toString(result)); // Output: [0, 1]
          }
        }
      `,
      csharp: `
        public class Solution {
          public int[] TwoSum(int[] nums, int target) {
            // Write your code here
            return new int[]{};
          }

          public static void Main(string[] args) {
            Solution solution = new Solution();
            int[] nums = {2, 7, 11, 15};
            int target = 9;
            int[] result = solution.TwoSum(nums, target);
            System.Console.WriteLine(string.Join(", ", result)); // Output: 0, 1
          }
        }
      `,
      python: `
        def two_sum(nums, target):
          # Write your code here
          return []

        # Example usage:
        # print(two_sum([2, 7, 11, 15], 9))  # Output: [0, 1]
      `,
      c: `
        #include <stdio.h>
        #include <stdlib.h>

        int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
          int* result = malloc(2 * sizeof(int));
          *returnSize = 2;
          // Write your code here
          return result;
        }

        int main() {
          int nums[] = {2, 7, 11, 15};
          int target = 9;
          int returnSize;
          int* result = twoSum(nums, 4, target, &returnSize);
          printf("[%d, %d]\\n", result[0], result[1]); // Output: [0, 1]
          free(result);
          return 0;
        }
      `,
      cpp: `
        #include <vector>
        #include <iostream>

        class Solution {
        public:
          std::vector<int> twoSum(std::vector<int>& nums, int target) {
            // Write your code here
            return std::vector<int>();
          }
        };

        int main() {
          Solution solution;
          std::vector<int> nums = {2, 7, 11, 15};
          int target = 9;
          std::vector<int> result = solution.twoSum(nums, target);
          std::cout << "[" << result[0] << ", " << result[1] << "]\\n"; // Output: [0, 1]
          return 0;
        }
      `,
    },
  },
  {
    id: 2,
    title: "Reverse a String",
    description: "Write a function that reverses a given string.",
    difficulty: "easy",
    example: {
      input: '"hello"',
      output: '"olleh"',
    },
    testCases: [
      { input: '"hello"', expected: 'olleh' },
      { input: '"world"', expected: 'dlrow' },
      { input: '"racecar"', expected: 'racecar' },
    ],
    status: "pending",
    starterCode: {
      javascript: `
        function reverseString(s) {
          // Write your code here
          return s;
        }

        // Example usage:
        // console.log(reverseString("hello")); // Output: "olleh"
      `,
      java: `
        class Solution {
          public String reverseString(String s) {
            // Write your code here
            return s;
          }

          public static void main(String[] args) {
            Solution solution = new Solution();
            String input = "hello";
            String result = solution.reverseString(input);
            System.out.println(result); // Output: "olleh"
          }
        }
      `,
      csharp: `
        public class Solution {
          public string ReverseString(string s) {
            // Write your code here
            return s;
          }

          public static void Main(string[] args) {
            Solution solution = new Solution();
            string input = "hello";
            string result = solution.ReverseString(input);
            System.Console.WriteLine(result); // Output: "olleh"
          }
        }
      `,
      python: `
        def reverse_string(s):
          # Write your code here
          return s

        # Example usage:
        # print(reverse_string("hello"))  # Output: "olleh"
      `,
      c: `
        #include <stdio.h>
        #include <string.h>

        char* reverseString(char* s) {
          // Write your code here
          return s;
        }

        int main() {
          char input[] = "hello";
          char* result = reverseString(input);
          printf("%s\\n", result); // Output: "olleh"
          return 0;
        }
      `,
      cpp: `
        #include <string>
        #include <iostream>

        class Solution {
        public:
          std::string reverseString(std::string s) {
            // Write your code here
            return s;
          }
        };

        int main() {
          Solution solution;
          std::string input = "hello";
          std::string result = solution.reverseString(input);
          std::cout << result << "\\n"; // Output: "olleh"
          return 0;
        }
      `,
    },
  },
  {
    id: 3,
    title: "Palindrome Number",
    description:
      "Given an integer x, return true if x is a palindrome, and false otherwise.",
    difficulty: "medium",
    example: {
      input: "121",
      output: "true",
    },
    testCases: [
      { input: "121", expected: "true" },
      { input: "-121", expected: "false" },
      { input: "10", expected: "false" },
    ],
    status: "pending",
    starterCode: {
      javascript: `
        function isPalindrome(x) {
          // Write your code here
          return false;
        }

        // Example usage:
        // console.log(isPalindrome(121)); // Output: true
      `,
      java: `
        class Solution {
          public boolean isPalindrome(int x) {
            // Write your code here
            return false;
          }

          public static void main(String[] args) {
            Solution solution = new Solution();
            int input = 121;
            boolean result = solution.isPalindrome(input);
            System.out.println(result); // Output: true
          }
        }
      `,
      csharp: `
        public class Solution {
          public bool IsPalindrome(int x) {
            // Write your code here
            return false;
          }

          public static void Main(string[] args) {
            Solution solution = new Solution();
            int input = 121;
            bool result = solution.IsPalindrome(input);
            System.Console.WriteLine(result); // Output: true
          }
        }
      `,
      python: `
        def is_palindrome(x):
          # Write your code here
          return False

        # Example usage:
        # print(is_palindrome(121))  # Output: True
      `,
      c: `
        #include <stdbool.h>
        #include <stdio.h>

        bool isPalindrome(int x) {
          // Write your code here
          return false;
        }

        int main() {
          int input = 121;
          bool result = isPalindrome(input);
          printf(result ? "true\\n" : "false\\n"); // Output: true
          return 0;
        }
      `,
      cpp: `
        #include <iostream>

        class Solution {
        public:
          bool isPalindrome(int x) {
            // Write your code here
            return false;
          }
        };

        int main() {
          Solution solution;
          int input = 121;
          bool result = solution.isPalindrome(input);
          std::cout << (result ? "true" : "false") << "\\n"; // Output: true
          return 0;
        }
      `,
    },
  },
  {
    id: 4,
    title: "Find the Missing Number",
    description:
      "Given an array containing n distinct numbers taken from 0 to n, find the missing number.",
    difficulty: "medium",
    example: {
      input: "[3,0,1]",
      output: "2",
    },
    testCases: [
      { input: "[3,0,1]", expected: "2" },
      { input: "[0,1]", expected: "2" },
      { input: "[9,6,4,2,3,5,7,0,1]", expected: "8" },
    ],
    status: "pending",
    starterCode: {
      javascript: `
        function missingNumber(nums) {
          // Write your code here
          return 0;
        }

        // Example usage:
        // console.log(missingNumber([3, 0, 1])); // Output: 2
      `,
      java: `
        class Solution {
          public int missingNumber(int[] nums) {
            // Write your code here
            return 0;
          }

          public static void main(String[] args) {
            Solution solution = new Solution();
            int[] nums = {3, 0, 1};
            int result = solution.missingNumber(nums);
            System.out.println(result); // Output: 2
          }
        }
      `,
      csharp: `
        public class Solution {
          public int MissingNumber(int[] nums) {
            // Write your code here
            return 0;
          }

          public static void Main(string[] args) {
            Solution solution = new Solution();
            int[] nums = {3, 0, 1};
            int result = solution.MissingNumber(nums);
            System.Console.WriteLine(result); // Output: 2
          }
        }
      `,
      python: `
        def missing_number(nums):
          # Write your code here
          return 0

        # Example usage:
        # print(missing_number([3, 0, 1]))  # Output: 2
      `,
      c: `
        #include <stdio.h>

        int missingNumber(int* nums, int numsSize) {
          // Write your code here
          return 0;
        }

        int main() {
          int nums[] = {3, 0, 1};
          int result = missingNumber(nums, 3);
          printf("%d\\n", result); // Output: 2
          return 0;
        }
      `,
      cpp: `
        #include <vector>
        #include <iostream>

        class Solution {
        public:
          int missingNumber(std::vector<int>& nums) {
            // Write your code here
            return 0;
          }
        };

        int main() {
          Solution solution;
          std::vector<int> nums = {3, 0, 1};
          int result = solution.missingNumber(nums);
          std::cout << result << "\\n"; // Output: 2
          return 0;
        }
      `,
    },
  },
  {
    id: 5,
    title: "Valid Parentheses",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "hard",
    example: {
      input: '"()"',
      output: "true",
    },
    testCases: [
      { input: '"()"', expected: "true" },
      { input: '"()[]{}"', expected: "true" },
      { input: '"(]"', expected: "false" },
    ],
    status: "pending",
    starterCode: {
      javascript: `
        function isValid(s) {
          // Write your code here
          return false;
        }

        // Example usage:
        // console.log(isValid("()")); // Output: true
      `,
      java: `
        class Solution {
          public boolean isValid(String s) {
            // Write your code here
            return false;
          }

          public static void main(String[] args) {
            Solution solution = new Solution();
            String input = "()";
            boolean result = solution.isValid(input);
            System.out.println(result); // Output: true
          }
        }
      `,
      csharp: `
        public class Solution {
          public bool IsValid(string s) {
            // Write your code here
            return false;
          }

          public static void Main(string[] args) {
            Solution solution = new Solution();
            string input = "()";
            bool result = solution.IsValid(input);
            System.Console.WriteLine(result); // Output: true
          }
        }
      `,
      python: `
        def is_valid(s):
          # Write your code here
          return False

        # Example usage:
        # print(is_valid("()"))  # Output: True
      `,
      c: `
        #include <stdbool.h>
        #include <stdio.h>

        bool isValid(char* s) {
          // Write your code here
          return false;
        }

        int main() {
          char input[] = "()";
          bool result = isValid(input);
          printf(result ? "true\\n" : "false\\n"); // Output: true
          return 0;
        }
      `,
      cpp: `
        #include <string>
        #include <iostream>

        class Solution {
        public:
          bool isValid(std::string s) {
            // Write your code here
            return false;
          }
        };

        int main() {
          Solution solution;
          std::string input = "()";
          bool result = solution.isValid(input);
          std::cout << (result ? "true" : "false") << "\\n"; // Output: true
          return 0;
        }
      `,
    },
  },
  {
    id: 6,
    title: "Maximum Subarray",
    description:
      "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    difficulty: "medium",
    example: {
      input: "[-2,1,-3,4,-1,2,1,-5,4]",
      output: "6",
      explanation: "The subarray [4,-1,2,1] has the largest sum = 6.",
    },
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" },
      { input: "[1]", expected: "1" },
      { input: "[-1,-2,-3]", expected: "-1" },
    ],
    status: "pending",
    starterCode: {
      javascript: `
        function maxSubArray(nums) {
          // Write your code here
          return nums[0] || 0;
        }

        // Example usage:
        // console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Output: 6
      `,
      java: `
        class Solution {
          public int maxSubArray(int[] nums) {
            // Write your code here
            return nums.length > 0 ? nums[0] : 0;
          }

          public static void main(String[] args) {
            Solution solution = new Solution();
            int[] nums = {-2,1,-3,4,-1,2,1,-5,4};
            int result = solution.maxSubArray(nums);
            System.out.println(result); // Output: 6
          }
        }
      `,
      csharp: `
        public class Solution {
          public int MaxSubArray(int[] nums) {
            // Write your code here
            return nums.Length > 0 ? nums[0] : 0;
          }

          public static void Main(string[] args) {
            Solution solution = new Solution();
            int[] nums = {-2,1,-3,4,-1,2,1,-5,4};
            int result = solution.MaxSubArray(nums);
            System.Console.WriteLine(result); // Output: 6
          }
        }
      `,
      python: `
        def max_sub_array(nums):
          # Write your code here
          return nums[0] if nums else 0

        # Example usage:
        # print(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))  # Output: 6
      `,
      c: `
        #include <stdio.h>

        int maxSubArray(int* nums, int numsSize) {
          // Write your code here
          return numsSize > 0 ? nums[0] : 0;
        }

        int main() {
          int nums[] = {-2,1,-3,4,-1,2,1,-5,4};
          int result = maxSubArray(nums, 9);
          printf("%d\\n", result); // Output: 6
          return 0;
        }
      `,
      cpp: `
        #include <vector>
        #include <iostream>

        class Solution {
        public:
          int maxSubArray(std::vector<int>& nums) {
            // Write your code here
            return nums.empty() ? 0 : nums[0];
          }
        };

        int main() {
          Solution solution;
          std::vector<int> nums = {-2,1,-3,4,-1,2,1,-5,4};
          int result = solution.maxSubArray(nums);
          std::cout << result << "\\n"; // Output: 6
          return 0;
        }
      `,
    },
  },
  {
    id: 7,
    title: "Longest Common Prefix",
    description:
      "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
    difficulty: "easy",
    example: {
      input: '["flower","flow","flight"]',
      output: '"fl"',
      explanation: "The longest common prefix among the strings is 'fl'.",
    },
    testCases: [
      { input: '["flower","flow","flight"]', expected: '"fl"' },
      { input: '["dog","racecar","car"]', expected: '""' },
      { input: '["interspecies","interstellar","interstate"]', expected: '"inter"' },
    ],
    status: "pending",
    starterCode: {
      javascript: `
        function longestCommonPrefix(strs) {
          // Write your code here
          return "";
        }

        // Example usage:
        // console.log(longestCommonPrefix(["flower","flow","flight"])); // Output: "fl"
      `,
      java: `
        class Solution {
          public String longestCommonPrefix(String[] strs) {
            // Write your code here
            return "";
          }

          public static void main(String[] args) {
            Solution solution = new Solution();
            String[] input = {"flower","flow","flight"};
            String result = solution.longestCommonPrefix(input);
            System.out.println(result); // Output: "fl"
          }
        }
      `,
      csharp: `
        public class Solution {
          public string LongestCommonPrefix(string[] strs) {
            // Write your code here
            return "";
          }

          public static void Main(string[] args) {
            Solution solution = new Solution();
            string[] input = {"flower","flow","flight"};
            string result = solution.LongestCommonPrefix(input);
            System.Console.WriteLine(result); // Output: "fl"
          }
        }
      `,
      python: `
        def longest_common_prefix(strs):
          # Write your code here
          return ""

        # Example usage:
        # print(longest_common_prefix(["flower","flow","flight"]))  # Output: "fl"
      `,
      c: `
        #include <stdio.h>
        #include <stdlib.h>
        #include <string.h>

        char* longestCommonPrefix(char** strs, int strsSize) {
          char* result = malloc(1);
          result[0] = '\\0';
          // Write your code here
          return result;
        }

        int main() {
          char* input[] = {"flower","flow","flight"};
          char* result = longestCommonPrefix(input, 3);
          printf("%s\\n", result); // Output: "fl"
          free(result);
          return 0;
        }
      `,
      cpp: `
        #include <vector>
        #include <string>
        #include <iostream>

        class Solution {
        public:
          std::string longestCommonPrefix(std::vector<std::string>& strs) {
            // Write your code here
            return "";
          }
        };

        int main() {
          Solution solution;
          std::vector<std::string> input = {"flower","flow","flight"};
          std::string result = solution.longestCommonPrefix(input);
          std::cout << result << "\\n"; // Output: "fl"
          return 0;
        }
      `,
    },
  },
];