import { getProviders, signIn } from "next-auth/react";

function login({ providers }) {
    console.log(providers);
    return (
        <div className="bg-black grid place-items-center min-h-screen w-ful">
            <img
                className="mb-5 w-96"
                src="https://spotlightstudio.org/wp-content/uploads/2019/12/image-gallery-spotify-logo-21.png"
                alt=""
            />
            {Object.values(providers).map((provider) => (
                <div
                    key={provider.name}
                    className="text-center text-white bg-green-500 py-4 px-8 rounded-lg opacity-90 hover:opacity-100">
                    <button
                        className="tracking-[0.12rem] font-bold w-full"
                        onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
                        Login With {provider.name}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default login;

export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: {
            providers,
        },
    };
}
