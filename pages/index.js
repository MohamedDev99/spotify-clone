import { getSession } from "next-auth/react";
import Head from "next/head";
import Center from "../components/Center";
import Player from "../components/Player";
import SideBar from "../components/SideBar";

export default function Home() {
    return (
        <div className="bg-black h-screen overflow-hidden">
            <Head>
                <title>Spotify Clone</title>
                <link rel="icon" href="https://links.papareact.com/9xl" />
            </Head>
            <main className="flex flex-col-reverse md:flex-row h-screen overflow-hidden">
                <SideBar />
                <Center />
            </main>
            <div className="sticky bottom-0">
                <Player />
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    return {
        props: {
            session,
        },
    };
}
