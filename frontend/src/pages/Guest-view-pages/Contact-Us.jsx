import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, Phone } from "lucide-react";
import Footer from "@/components/ui/footer";

// Custom email validation function
const emailValidation = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ContactUsPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Clear previous error messages
    setErrorMessage("");

    // Custom email validation check
    if (!emailValidation(email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    const formData = { name, email, message };

    try {
      const response = await fetch(
        "http://localhost:3000/api/guest/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();

      if (result.success) {
        // You might consider a success notification here as well.
        // For now, we're simply resetting the form.
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setErrorMessage("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setErrorMessage("Error sending email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header className="relative w-full pt-6 overflow-hidden rounded-b-[2.5rem] bg-gradient-to-b from-indigo-700 via-purple-400 to-pink-200 px-6 text-center md:px-8 md:py-24">
        {/* Main Content */}
        <div className="mx-auto max-w-4xl space-y-6 pt-28">
          <h1 className="text-4xl font-semibold text-white md:text-6xl max-w-3xl mx-auto font-hero tracking-wide [text-shadow:0px_0px_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-transform duration-300">
            Connect With Our Team
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/90 md:text-xl">
            Have any inquiries or feedback? Fill out the form below or email us,
            and we'll get back to you as soon as possible!
          </p>
        </div>
      </header>

      <section>
        <div className="min-h-screen bg-white p-6 md:p-12">
          <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-purple-50 via-purple-50 to-pink-100 p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-8">
                  <div>
                    <h1 className="mb-6 text-2xl font-medium text-neutral-900 md:text-5xl">
                      Contact Us
                    </h1>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                      <div className="mb-4">
                        <MessageCircle className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-neutral-900">
                        Reach Out to Us
                      </h3>
                      <p className="mb-3 text-sm text-gray-600">
                        Need assistance? Drop us a message anytime.
                      </p>
                      <a
                        href="mailto:landeros@email.com"
                        className="text-sm text-purple-600 hover:underline"
                      >
                        codify.dev2025@email.com
                      </a>
                    </div>
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                      <div className="mb-4">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">Call Us</h3>
                      <p className="mb-3 text-sm text-gray-600">
                        Need help? Give us a call—we're here for you.
                      </p>
                      <a
                        href="tel:+1234567890"
                        className="text-sm text-primary hover:underline"
                      >
                        +1234567890
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column - Contact Form */}
                <div>
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <Input
                            placeholder="Jane Smith"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 border-gray-200"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <Input
                            type="email"
                            placeholder="jane@framer.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 border-gray-200"
                          />
                          {errorMessage && (
                            <p className="text-red-500 text-sm mt-1">
                              {errorMessage}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Message
                          </label>
                          <Textarea
                            placeholder="message goes here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-1 border-gray-200"
                            rows={4}
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </div>
  );
};

export default ContactUsPage;
