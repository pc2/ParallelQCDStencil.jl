var documenterSearchIndex = {"docs":
[{"location":"references/exports/#All-Exports","page":"All Exports","title":"All Exports","text":"","category":"section"},{"location":"references/exports/#Index","page":"All Exports","title":"Index","text":"","category":"section"},{"location":"references/exports/","page":"All Exports","title":"All Exports","text":"Pages   = [\"exports.md\"]\nOrder   = [:function, :type]","category":"page"},{"location":"references/exports/#References","page":"All Exports","title":"References","text":"","category":"section"},{"location":"references/exports/","page":"All Exports","title":"All Exports","text":"Modules = [ParallelQCDStencil]\nPrivate = false","category":"page"},{"location":"references/exports/#ParallelQCDStencil.ComputationMode","page":"All Exports","title":"ParallelQCDStencil.ComputationMode","text":"Computation mode for selection between serial or parallel computation.\n\n\n\n\n\n","category":"type"},{"location":"references/exports/#ParallelQCDStencil.StencilPara","page":"All Exports","title":"ParallelQCDStencil.StencilPara","text":"Struct with default values\n\n\n\n\n\n","category":"type"},{"location":"references/exports/#ParallelQCDStencil.compute_stencil-Tuple{Any, Any, MPI.Comm, Int64, LocalGridNaive}","page":"All Exports","title":"ParallelQCDStencil.compute_stencil","text":"Compute stencil in parallel\n\n\n\n\n\n","category":"method"},{"location":"references/exports/#ParallelQCDStencil.compute_stencil-Tuple{Any, Any, Sequential}","page":"All Exports","title":"ParallelQCDStencil.compute_stencil","text":"Compute stencil in serial\n\n\n\n\n\n","category":"method"},{"location":"references/exports/#ParallelQCDStencil.get_site_link_indexes-Tuple{Any, Any}","page":"All Exports","title":"ParallelQCDStencil.get_site_link_indexes","text":"Computes the site link indexes\n\n\n\n\n\n","category":"method"},{"location":"references/exports/#ParallelQCDStencil.linear_link_values_to_site_based_array-Tuple{Any, Any}","page":"All Exports","title":"ParallelQCDStencil.linear_link_values_to_site_based_array","text":"Converting the link/file data into site centric structure\n\n\n\n\n\n","category":"method"},{"location":"#ParallelQCDStencil.jl","page":"ParallelQCDStencil","title":"ParallelQCDStencil.jl","text":"","category":"section"},{"location":"#Installation","page":"ParallelQCDStencil","title":"Installation","text":"","category":"section"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"] add https://git.uni-paderborn.de/cs-hit/theses/2022_parab/qcd-stencil/ParallelQCDStencil.jl","category":"page"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"Note: The minimal required Julia version is 1.7.","category":"page"},{"location":"#Usage","page":"ParallelQCDStencil","title":"Usage","text":"","category":"section"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"julia> using ParallelQCDStencil","category":"page"},{"location":"#Input-parameters","page":"ParallelQCDStencil","title":"Input parameters","text":"","category":"section"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"We are using struct for passing around the parameters to the fuctions. It consists of :","category":"page"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"d = 2                           #diamensions\nL = 5                           #number of lattices in per diamension\nN = L^d                         #number of sites\nNL = N * d                      #number of links\nLD = 3                          #link matrix length\nC1::T = 2                 #stencil constant \nC2::T = 3                 #stencil constant   \nLG = 2                          #local grid length\nn_LG_d = Int(floor(L / LG))     #grids per diamension\nn_LG = n_LG_d^d                 #number of local grids\nmaster_rank = 0                 #mpi master rank","category":"page"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"The struct can be construced using :","category":"page"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"p = StencilPara(; d=2, L=4, LG=2, master_rank=0)","category":"page"},{"location":"#Input-data","page":"ParallelQCDStencil","title":"Input data","text":"","category":"section"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"For stencil computation input can be: ","category":"page"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"vector of link data ()","category":"page"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"rmat = rand(ComplexF64,(3,3))  \ndata = [rmat for i in 1:NL]","category":"page"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"HDF5 file path : \nFile containing array with variable name \"data\" \ne.g. 2D array of size 10x10x2x3x3 ","category":"page"},{"location":"#Basic-Example-with-array-input","page":"ParallelQCDStencil","title":"Basic Example with array input","text":"","category":"section"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"#basic_example.jl\nusing MPI\nusing Parameters\nusing LinearAlgebra\nusing Test\n\np = StencilPara(; d=2, L=10, LG=5, master_rank=1)\n@unpack NL, master_rank, C1, C2, N = p\nMPI.Init()\ncomm = MPI.COMM_WORLD\nrank = MPI.Comm_rank(comm)\n\nif (rank == master_rank)\n    rmat = [\n        0.630657+0.343875im 0.682196+0.797296im 0.641287+0.931409im\n        0.566447+0.395339im 0.186153+0.685137im 0.484366+0.325613im\n        0.561107+0.889588im 0.978503+0.803343im 0.69018+0.652149im\n    ]\n    data = ParallelQCDStencil.linear_link_values_to_site_based_array_2d(p, [rmat for i in 1:NL])\nelse\n    data = nothing\nend\ntotal = compute_stencil(p, data, comm, rank, LocalGridNaive())\n\nif (rank == master_rank)\n    println(\"total:$(total)\\n\")\nend\nMPI.Finalize()","category":"page"},{"location":"#Basic-Example-with-file-input","page":"ParallelQCDStencil","title":"Basic Example with file input","text":"","category":"section"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"using ParallelQCDStencil\nusing MPI\nusing Parameters\nusing LinearAlgebra\nusing Test\nusing HDF5\n\np = StencilPara(; d=2, L=10, LG=5, master_rank=1)\n@unpack NL, master_rank, C1, C2, N, L, d = p\n\nMPI.Init()\ncomm = MPI.COMM_WORLD\nrank = MPI.Comm_rank(comm)\nfile = \"2d_array_l_10_cf64.h5\"\ntotal = compute_stencil(p, file, comm, rank, LocalGridNaive(); file=true)\n\nif (rank == master_rank)\n    println(\"total:$(total)\\n\")\nend\nMPI.Finalize()\n","category":"page"},{"location":"#Code-execution","page":"ParallelQCDStencil","title":"Code execution","text":"","category":"section"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"The program can be launched using MPI command e.g:","category":"page"},{"location":"","page":"ParallelQCDStencil","title":"ParallelQCDStencil","text":"mpirun -n 4 julia --project basic_example.jl","category":"page"}]
}
