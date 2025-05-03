import Container from "@/components/ui/Container";

export default function Home() {
  return (
    <Container>
      <div className="flex flex-col items-center gap-12 py-12">
        <h1 className="text-4xl font-bold">Welcome to Lego Pic</h1>
        <p className="text-xl text-center max-w-2xl">
          Transform your photos into Lego-style images with our easy-to-use tool.
        </p>
        
        <div className="flex gap-6 mt-6">
          <a
            href="/photo-picker"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
          <a
            href="#how-it-works"
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Learn More
          </a>
        </div>
        
        <div className="mt-12 w-full">
          <h2 className="text-2xl font-semibold mb-6 text-center" id="how-it-works">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Upload Your Photo</h3>
              <p className="text-gray-600">Select any photo from your device to convert.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Choose Your Style</h3>
              <p className="text-gray-600">Select from different Lego brick styles and colors.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Download Result</h3>
              <p className="text-gray-600">Get your Lego-style image and share it with friends.</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
