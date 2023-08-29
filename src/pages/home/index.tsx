// home page
import HomeLayout from "@/layout/HomeLayout";
import { HomeSubData } from "@/utils/constants";
import HomeHistory from "./components/history/History";
import SettingsLayout from "@/layout/SettingsLayout";
import { useRouter } from "next/router";
import FileUpload from "./components/FileUpload";
import BasicTabs from './components/history/tab';

function Home() {
  const showTitle = false;
  const router = useRouter();
  console.log(router, "i am router");
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className='pb-5'>
        <h1 className="text-2xl pl-10 font-bold">Add Content</h1>
        <FileUpload />
      <BasicTabs />
    </div>
  );
}

export default Home;
