import LeftSideSeeker from "@/components/ui/LeftSideSeeker";


function ExplorePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <LeftSideSeeker />
                </div>
                {/* Main Content  */}
            </div>
        </div>
    );
}

export default ExplorePage;
