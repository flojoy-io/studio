import uvicorn, sys, os

__ignore_list = ["venv"]

if __name__ == "__main__":
    log_level = (
        sys.argv[sys.argv.index("--log-level") + 1]
        if "--log-level" in sys.argv
        else "info"
    )
    uvicorn.run(  # type:ignore
        "captain.main:app",
        port=8001,
        log_level=log_level,
        reload=True,
        reload_excludes=[
            os.path.join(os.getcwd(), p)
            for p in __ignore_list
            if os.path.exists(os.path.join(os.getcwd(), p))
        ],
    )
